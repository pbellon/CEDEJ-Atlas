import React from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { fromFilters } from 'store/selectors';
import { toggleCircleSizeVisibility } from 'store/actions';
import { ToggleFilter, Heading } from 'components';
import { monthsDescription } from 'utils/circles';

import AtlasPropTypes from 'atlas-prop-types';

const Cols = styled.div`
  display: flex;
  justify-content: space-around;
  
`;

const Col = styled.div`
  flex-grow: 1;
  flex-base: 1;
`;

const Holder = styled.div``;
const CircleSizesFilters = ({
  t,
  onToggle,
  sizes,
  layer,
}) => {
  const sarr = Object.keys(sizes)
    .map(key => sizes[key]);

  const cols = [
    [sarr[0], sarr[2], sarr[4], sarr[6]],
    [sarr[1], sarr[3], sarr[5]],
  ];

  return (
    <Holder>
      <Heading
        style={{ marginBottom: 0 }}
        level={6}
      >
        { t('sidebar.numberOfMonths') } 
      </Heading>
      <Cols>
        { cols.map((colSizes, colKey) => (
          <Col key={`col-circlefilter-${colKey}`}>
            { colSizes.map(size => (
              <ToggleFilter
                id={`circle-size-${size.name}-filter`}
                key={`circle-size-filter-${size.name}`}
                layer={layer}
                toggled={size.visible}
                onToggle={onToggle(size)}
                label={monthsDescription(size.name)}
              />
            ))}
          </Col>
        ))}
      </Cols>
    </Holder>
  );
};

CircleSizesFilters.propTypes = {
  onToggle: PropTypes.func,
  sizes: AtlasPropTypes.filters,
  layer: AtlasPropTypes.layer,
};

const mapDispatchToProps = dispatch => ({
  onToggle: (type) => () => (
    dispatch(toggleCircleSizeVisibility(type))
  ),
});

const mapStateToProps = (state, ownProps) => ({
  sizes: fromFilters.circlesSizes(state),
  layer: ownProps.layer,
});


export default connect(mapStateToProps, mapDispatchToProps)(
  translate('atlas')(CircleSizesFilters)
);
